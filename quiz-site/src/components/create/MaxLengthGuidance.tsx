export function MaxLengthGuidance(props: {
  text: string | null | undefined;
  maxLength: number;
}) {
  const { text, maxLength } = props;
  return (
    <div
      className={`${
        text && maxLength - text.length === 0 ? "text-red-400" : "text-gray-400"
      } `}
    >
      {text && maxLength - text.length <= 20 && maxLength - text.length}
    </div>
  );
}
