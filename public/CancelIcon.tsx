type Props = {
    fill?: string;
    className?: string
};
export const CancelIcon = ({fill, className}: Props) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className || ""}
    >
      <path
        d="M6.75781 17.243L12.0008 12L17.2438 17.243M17.2438 6.75696L11.9998 12L6.75781 6.75696"
        stroke={fill || 'black'}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CancelIcon;
