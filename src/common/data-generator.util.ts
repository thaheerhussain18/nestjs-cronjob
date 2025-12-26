export class DataGenerator {
  private static readonly adjectives = [
    'Swift', 'Bright', 'Cosmic', 'Dynamic', 'Epic', 'Fierce', 'Golden', 'Heroic',
    'Infinite', 'Joyful', 'Keen', 'Lunar', 'Mystic', 'Noble', 'Optic', 'Phoenix',
    'Quantum', 'Radiant', 'Stellar', 'Turbo', 'Ultra', 'Vivid', 'Wizard', 'Xenial', 'Zenith'
  ];

  private static readonly nouns = [
    'Tiger', 'Eagle', 'Dragon', 'Falcon', 'Panther', 'Wolf', 'Lion', 'Hawk',
    'Storm', 'Blaze', 'Thunder', 'Lightning', 'Crystal', 'Diamond', 'Sapphire',
    'Phoenix', 'Meteor', 'Comet', 'Nova', 'Galaxy', 'Nebula', 'Vortex', 'Titan', 'Atlas', 'Omega'
  ];

  private static readonly actions = [
    'Creating', 'Building', 'Designing', 'Crafting', 'Forging', 'Developing',
    'Assembling', 'Generating', 'Composing', 'Constructing', 'Engineering',
    'Fabricating', 'Modeling', 'Producing', 'Synthesizing', 'Innovating',
    'Architecting', 'Orchestrating', 'Pioneering', 'Cultivating'
  ];

  private static getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Generate a unique code with format: PREFIX-TIMESTAMP-SEQUENCE
   * @param sequenceNumber - Sequential number for uniqueness
   * @param timestamp - Optional timestamp (uses Date.now() if not provided)
   * @returns Unique code string
   */
  static generateUniqueCode(sequenceNumber: number, timestamp?: number): string {
    const ts = timestamp || Date.now();
    const adj = this.getRandomElement(this.adjectives);
    const noun = this.getRandomElement(this.nouns);
    const prefix = `${adj.substring(0, 2).toUpperCase()}${noun.substring(0, 2).toUpperCase()}`;
    const timestampSuffix = ts.toString().slice(-6);
    const sequence = sequenceNumber.toString().padStart(7, '0');
    
    return `${prefix}-${timestampSuffix}-${sequence}`;
  }

  /**
   * Generate a random name with adjective + noun combination
   * @returns Random name string
   */
  static generateRandomName(): string {
    const adj = this.getRandomElement(this.adjectives);
    const noun = this.getRandomElement(this.nouns);
    return `${adj} ${noun}`;
  }

  /**
   * Generate a random description
   * @param projectNumber - Project number to include in description
   * @returns Description string
   */
  static generateDescription(projectNumber: number): string {
    const action = this.getRandomElement(this.actions);
    const adj = this.getRandomElement(this.adjectives);
    const noun = this.getRandomElement(this.nouns);
    return `${action} ${adj.toLowerCase()} ${noun.toLowerCase()} project #${projectNumber}`;
  }

  /**
   * Generate a complete random data record
   * @param sequenceNumber - Sequential number for the record
   * @param timestamp - Optional timestamp for uniqueness
   * @returns Object with name, code, and description
   */
  static generateRecord(
    sequenceNumber: number,
    timestamp?: number
  ): { name: string; code: string; description: string } {
    return {
      name: this.generateRandomName(),
      code: this.generateUniqueCode(sequenceNumber, timestamp),
      description: this.generateDescription(sequenceNumber),
    };
  }

  /**
   * Generate multiple records in batch
   * @param count - Number of records to generate
   * @param startIndex - Starting index for sequence numbers
   * @param timestamp - Optional timestamp for uniqueness
   * @returns Array of generated records
   */
  static generateBatch(
    count: number,
    startIndex: number = 1,
    timestamp?: number
  ): Array<{ name: string; code: string; description: string }> {
    const records: Array<{ name: string; code: string; description: string }> = [];
    const ts = timestamp || Date.now();
    
    for (let i = 0; i < count; i++) {
      records.push(this.generateRecord(startIndex + i, ts));
    }
    
    return records;
  }
}
