interface ErrorSerializerOptions {
    include?: string[],
    exclude?: string[],
};

type ErrorSerializer = (err: any) => any;

export default function createErrorSerializer(options?: ErrorSerializerOptions): Promise<ErrorSerializer>;
