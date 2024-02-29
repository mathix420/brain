import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { CloudflareWorkersAI } from "@langchain/cloudflare";
import { pull } from "langchain/hub";

export default defineEventHandler(async (event) => {
  const { uri } = getQuery<{ uri: string }>(event);

  if (!uri?.length) {
    throw new Error(`Missing URI.`);
  }

  // Tune based on your raw content.
  // TODO: HTML -> Filter unecessary content -> Convert HTML to Markdown -> Use Markdown Splitter
  const splitter = RecursiveCharacterTextSplitter.fromLanguage("html", {
    chunkSize: 1024,
    chunkOverlap: 100,
  });

  const webLoader = new CheerioWebBaseLoader(uri, {
    selector: "main",
  });
  const htmlPage = await webLoader.load();
  const splittedHtmlPage = await splitter.splitDocuments(htmlPage);

  const cloudflareModel = new CloudflareWorkersAI({
    model: "@hf/thebloke/mistral-7b-instruct-v0.1-awq",
    cloudflareAccountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    cloudflareApiToken: process.env.CLOUDFLARE_WORKERSAI_API_TOKEN,
  });

  // TODO: create a custom prompt that will return keywords + summary of the page in JSON format
  const prompt = await pull<ChatPromptTemplate>("rlm/rag-prompt");

  const ragChain = await createStuffDocumentsChain({
    llm: cloudflareModel,
    prompt,
    outputParser: new StringOutputParser(),
  });

  return ragChain.invoke({
    question: "Generate a list of keywords based on the content of this page.",
    context: splittedHtmlPage,
  });
});
