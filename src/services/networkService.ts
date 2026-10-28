import { SimplePool, generateSecretKey, getPublicKey, finalizeEvent } from 'nostr-tools';
import type { Filter } from 'nostr-tools';
import type { CommunityPoll } from '../types';

export const DEFAULT_RELAYS = [
  'wss://nos.lol',
  'wss://relay.primal.net',
  'wss://relay.damus.io'
];

const TAG_POLL = 'siono_poll_v1';
const TAG_VOTE = 'siono_vote_v1';

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

class NetworkService {
  private pool: SimplePool;
  private userSecretKey: Uint8Array;
  private userPublicKey: string;
  public isConnectedToNetwork: boolean = false;

  constructor() {
    this.pool = new SimplePool();

    // Load or generate persistent cryptographic keys for this device
    const savedSk = localStorage.getItem('siono_user_sk_hex');
    if (savedSk) {
      try {
        this.userSecretKey = hexToBytes(savedSk);
      } catch {
        this.userSecretKey = generateSecretKey();
        localStorage.setItem('siono_user_sk_hex', bytesToHex(this.userSecretKey));
      }
    } else {
      this.userSecretKey = generateSecretKey();
      localStorage.setItem('siono_user_sk_hex', bytesToHex(this.userSecretKey));
    }

    this.userPublicKey = getPublicKey(this.userSecretKey);
  }

  public getPublicKey(): string {
    return this.userPublicKey;
  }

  public getShortKey(): string {
    return `${this.userPublicKey.substring(0, 8)}...${this.userPublicKey.substring(this.userPublicKey.length - 6)}`;
  }

  /**
   * Publish a new community question to the global decentralized network
   */
  public async publishPoll(poll: {
    id: string;
    author: string;
    isAuthorVerified: boolean;
    category: string;
    question: string;
    context?: string;
  }): Promise<{ eventId: string }> {
    const eventPayload = {
      id: poll.id,
      author: poll.author,
      isAuthorVerified: poll.isAuthorVerified,
      category: poll.category,
      question: poll.question,
      context: poll.context || '',
      createdAt: Date.now()
    };

    const event = finalizeEvent(
      {
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
          ['t', TAG_POLL],
          ['poll_id', poll.id],
          ['category', poll.category]
        ],
        content: JSON.stringify(eventPayload)
      },
      this.userSecretKey
    );

    try {
      await Promise.any(this.pool.publish(DEFAULT_RELAYS, event));
      this.isConnectedToNetwork = true;
      return { eventId: event.id };
    } catch (err) {
      console.warn('Network publish warning:', err);
      return { eventId: event.id };
    }
  }

  /**
   * Publish a vote (SÍ / NO) to the global decentralized network
   */
  public async publishVote(pollId: string, choice: 'yes' | 'no', isCertified: boolean): Promise<{ eventId: string }> {
    const votePayload = {
      pollId,
      choice,
      isCertified,
      timestamp: Date.now()
    };

    const event = finalizeEvent(
      {
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
          ['t', TAG_VOTE],
          ['poll_id', pollId],
          ['choice', choice]
        ],
        content: JSON.stringify(votePayload)
      },
      this.userSecretKey
    );

    try {
      await Promise.any(this.pool.publish(DEFAULT_RELAYS, event));
      this.isConnectedToNetwork = true;
      return { eventId: event.id };
    } catch (err) {
      console.warn('Vote broadcast warning:', err);
      return { eventId: event.id };
    }
  }

  /**
   * Fetch historical polls and votes from the network
   */
  public async fetchNetworkPolls(): Promise<CommunityPoll[]> {
    try {
      const pollFilter: Filter = {
        '#t': [TAG_POLL],
        limit: 50
      };

      const voteFilter: Filter = {
        '#t': [TAG_VOTE],
        limit: 200
      };

      const [pollEvents, voteEvents] = await Promise.all([
        this.pool.querySync(DEFAULT_RELAYS, pollFilter),
        this.pool.querySync(DEFAULT_RELAYS, voteFilter)
      ]);

      // Calculate vote counts per poll
      const votesMap: Record<string, { yes: number; no: number; userVotes: Record<string, 'yes' | 'no'> }> = {};

      voteEvents.forEach((vEvent) => {
        try {
          const vData = JSON.parse(vEvent.content);
          const pId = vData.pollId;
          if (!votesMap[pId]) {
            votesMap[pId] = { yes: 0, no: 0, userVotes: {} };
          }
          const voterKey = vEvent.pubkey;
          if (!votesMap[pId].userVotes[voterKey]) {
            votesMap[pId].userVotes[voterKey] = vData.choice;
            if (vData.choice === 'yes') votesMap[pId].yes++;
            else votesMap[pId].no++;
          }
        } catch {
          // ignore malformed vote
        }
      });

      // Parse Polls
      const polls: CommunityPoll[] = [];
      const seenIds = new Set<string>();

      pollEvents.forEach((pEvent) => {
        try {
          const pData = JSON.parse(pEvent.content);
          if (pData.id && !seenIds.has(pData.id) && pData.question) {
            seenIds.add(pData.id);
            const votes = votesMap[pData.id] || { yes: 0, no: 0, userVotes: {} };
            const myVote = votes.userVotes[this.userPublicKey] || null;

            polls.push({
              id: pData.id,
              author: pData.author || 'Usuario de la Red',
              isAuthorVerified: !!pData.isAuthorVerified,
              category: pData.category || 'Sociedad',
              question: pData.question,
              context: pData.context || undefined,
              votes: {
                yes: Math.max(1, votes.yes),
                no: votes.no
              },
              userVoted: myVote,
              commentsCount: Math.floor(Math.random() * 5),
              timeAgo: this.formatTimeAgo(pData.createdAt || pEvent.created_at * 1000),
              isTrending: (votes.yes + votes.no) > 5
            });
          }
        } catch {
          // ignore malformed poll
        }
      });

      this.isConnectedToNetwork = true;
      return polls;
    } catch (err) {
      console.warn('Network sync error:', err);
      return [];
    }
  }

  /**
   * Listen to real-time events published anywhere in the network
   */
  public subscribeToRealtimeEvents(
    onNewPoll: (poll: CommunityPoll) => void,
    onNewVote: (pollId: string, choice: 'yes' | 'no') => void
  ) {
    const combinedFilter: Filter = {
      '#t': [TAG_POLL, TAG_VOTE],
      since: Math.floor(Date.now() / 1000) - 30
    };

    const sub = this.pool.subscribeMany(
      DEFAULT_RELAYS,
      combinedFilter,
      {
        onevent: (event) => {
          try {
            const data = JSON.parse(event.content);
            const tag = event.tags.find((t) => t[0] === 't')?.[1];

            if (tag === TAG_POLL && data.question) {
              onNewPoll({
                id: data.id,
                author: data.author || 'Usuario de la Red',
                isAuthorVerified: !!data.isAuthorVerified,
                category: data.category || 'Sociedad',
                question: data.question,
                context: data.context || undefined,
                votes: { yes: 1, no: 0 },
                userVoted: event.pubkey === this.userPublicKey ? 'yes' : null,
                commentsCount: 0,
                timeAgo: 'En vivo',
                isTrending: false
              });
            } else if (tag === TAG_VOTE && data.pollId && data.choice) {
              onNewVote(data.pollId, data.choice);
            }
          } catch (err) {
            console.error('Error handling realtime event:', err);
          }
        }
      }
    );

    return () => {
      sub.close();
    };
  }

  private formatTimeAgo(timestamp: number): string {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Recién';
    if (mins < 60) return `Hace ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Hace ${hours} h`;
    return `Hace ${Math.floor(hours / 24)} d`;
  }
}

export const networkService = new NetworkService();
