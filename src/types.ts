export type Input = {
    videoFile: string | string[]
    timestamp?: number;
    outputFormat?: 'jpg' | 'png';
    quality?: '1' | '5' | '15' | '30';
}