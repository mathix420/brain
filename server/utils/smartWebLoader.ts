import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { Document } from "@langchain/core/documents";

export class SmartWebLoader extends CheerioWebBaseLoader {
  /**
   * Extracts the text content from the loaded document using the selector
   * and creates a Document instance with the extracted text and metadata.
   * It returns an array of Document instances.
   * @returns A Promise that resolves to an array of Document instances.
   */
  async load() {
    const $ = await this.scrape();
    // TODO: Filter unecessary content
    const text = $(this.selector).text();
    const metadata = { source: this.webPath };
    return [new Document({ pageContent: text, metadata })];
  }
}
