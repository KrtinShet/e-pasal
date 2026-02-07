'use client';

type Props = {
  imgUrl?: string;
};

export function SingleFilePreview({ imgUrl = '' }: Props) {
  return (
    <div className="absolute inset-0 p-1">
      <img alt="file preview" src={imgUrl} className="w-full h-full object-cover rounded" />
    </div>
  );
}
