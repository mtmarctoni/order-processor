declare module '../utils/pdfParseLoader.cjs' {
  import { PDFData } from 'pdf-parse';
  
  interface PDFParseResult {
    text: string;
    info: any;
    metadata: any;
    version: string;
  }

  const pdfParse: (data: Buffer | Uint8Array | ArrayBuffer, options?: any) => Promise<PDFParseResult>;
  
  export default pdfParse;
}
