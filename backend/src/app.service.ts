import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { PDFLoader} from "langchain/document_loaders/fs/pdf";
import { Document } from "langchain/document";
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
 
 async test(){
  console.log('aiscanDocController');
  try {
      const path = `C:\\tmp\\imaChat.pdf`;
      const arrayBuffer = await fs.readFileSync(path);
      console.log(arrayBuffer)
      
      //const bookPath = path.resolve(__dirname, "bitcoin.pdf");
      const loader = new PDFLoader(path);
      
    const docs = await loader.load();
    console.log(docs);
    if (!docs || docs.length === 0) {
      console.log("No documents found.");
      return;
    }

    const splitter = new CharacterTextSplitter({
      separator: " ",
      chunkSize: 250,
      chunkOverlap: 10,
    });

    const splitDocs = await splitter.splitDocuments(docs);

    const reducedDocs = splitDocs.map((doc) => {
      const reducedMetadata = { ...doc.metadata };
      delete reducedMetadata.pdf; // Remove the 'pdf' field   
      return new Document({
        pageContent: doc.pageContent,
        metadata: reducedMetadata,
      });
    });
    // console.log(reducedDocs);
    // const embeddings = new OpenAIEmbeddings({
    //   model: "text-embedding-ada-002",
    //   chunkSize: 1,
    // });
  } catch (error) {
      console.log(error);
  }
}



async onModuleInit(): Promise<any> {
  await this.test();
}

}
