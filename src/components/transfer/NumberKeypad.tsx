import IconLeft from "@/assets/icons/icon_header_left.svg?react";
import IconButton from "@/components/common/IconButton";

export default function NumberKeypad({
  onUpdateAmount,
}: {
  onUpdateAmount: (value: number | "delete") => void;
}) {
  const KEYS: { id: string; text: string; value: number | "delete" }[] = [
    { id: "1", text: "1", value: 1 },
    { id: "2", text: "2", value: 2 },
    { id: "3", text: "3", value: 3 },
    { id: "4", text: "4", value: 4 },
    { id: "5", text: "5", value: 5 },
    { id: "6", text: "6", value: 6 },
    { id: "7", text: "7", value: 7 },
    { id: "8", text: "8", value: 8 },
    { id: "9", text: "9", value: 9 },
    { id: "blank", text: "", value: NaN },
    { id: "0", text: "0", value: 0 },
    { id: "delete", text: "delete", value: "delete" },
  ];
  const handleClick = (value: number | "delete") => {
    onUpdateAmount(value);
  };
  return (
    <ul className="w-full px-3 py-2 grid grid-cols-3">
      {KEYS.map(({ id, text, value }) => (
        <li className="p-1" key={id}>
          {id !== "blank" && (
            <IconButton
              className="w-full py-1"
              onClick={() => handleClick(value)}
            >
              {id === "delete" ? (
                <IconLeft />
              ) : (
                <p className="text-2xl py-1.5">{text}</p>
              )}
            </IconButton>
          )}
        </li>
      ))}
    </ul>
  );
}
