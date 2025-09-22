declare module "pdf-poppler" {
  interface ConvertOptions {
    format: string;
    out_dir: string;
    out_prefix: string;
    page: number | null;
  }

  class Poppler {
    static convert(filePath: string, options: ConvertOptions): Promise<void>;
  }

  export default Poppler;
}
