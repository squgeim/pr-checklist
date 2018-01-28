
declare module 'parse-diff' {

  interface Change {
    type: string;
    normal: boolean;
    ln1: number;
    ln2: number;
    content: string;
  }

  interface Chunk {
    content: string;
    changes: Change[];
    oldStart: number;
    oldLines: number;
    newStart: number;
    newLines: number;
  }

  interface File {
    chunks: Chunk[];
    deletions: number;
    additions: number,
    from: string,
    to: string,
    index: Array<string>
  }

  function parse(diff: string): File[];

  namespace parse {}
  export = parse;
}
