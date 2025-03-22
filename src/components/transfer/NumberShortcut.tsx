export default function NumberShortcut({
  disabled,
  onAddAmount,
}: {
  disabled: boolean;
  onAddAmount: (amount: number) => void;
}) {
  const SHORTCUTS = [
    { id: "1", text: "+1만", value: 10000 },
    { id: "2", text: "+5만", value: 50000 },
    { id: "3", text: "+10만", value: 100000 },
    { id: "4", text: "+200만", value: 2000000 },
  ];

  const handleClick = (value: number) => {
    onAddAmount(value);
  };

  return (
    <ul className="grid grid-cols-4 gap-2.5">
      {SHORTCUTS.map(({ id, text, value }) => (
        <li key={id}>
          <button
            className={`w-full p-1.5 rounded-full text-sm text-default text-opacity-55 ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300 hover:duration-100 duration-300 transition-all"} bg-secondary`}
            disabled={disabled}
            onClick={() => handleClick(value)}
          >
            {text}
          </button>
        </li>
      ))}
    </ul>
  );
}
