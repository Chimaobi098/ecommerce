
const AuctionIcon = ({className, size}: {className?: string, size?: number}) => {
  return (
    <svg
      width={size || "30"}
      height={size || "30"}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M17.5059 25.0038V27.5038H2.50586V25.0038H17.5059ZM18.2371 0.861267L27.9596 10.5838L26.1921 12.3513L24.8659 11.91L21.7721 15.0038L28.8434 22.075L27.0759 23.8425L20.0046 16.7713L16.9996 19.7763L17.3534 21.1913L15.5846 22.9588L5.86211 13.2363L7.62961 11.4675L9.04461 11.8213L16.9109 3.95502L16.4696 2.63002L18.2371 0.861267ZM19.1209 5.28127L10.2821 14.1188L14.7009 18.5388L23.5396 9.70127L19.1209 5.28127Z"
        fill="black"
      />
    </svg>
  );
};

export default AuctionIcon;
