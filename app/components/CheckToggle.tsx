import { Dispatch, SetStateAction, useCallback } from "react";
import { memo } from "react";

const CheckToggle = memo(function CheckToggle({
  checked,
  setChecked,
  text,
  textColour = "text-gray-900",
}: {
  checked: boolean;
  setChecked: Dispatch<SetStateAction<boolean>>;
  text: string;
  textColour?: string;
}) {
  const callback = useCallback(() => {
    setChecked(!checked);
  }, [checked, setChecked]);

  return (
    <div className="pt-4">
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={callback}
          className="sr-only peer"
        />
        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:rtl:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        <span className={"ms-3 text-sm font-medium " + textColour}>{text}</span>
      </label>
    </div>
  );
});

export default CheckToggle;
