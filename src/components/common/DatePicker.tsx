import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import { CalenderIcon } from "../../icons";

export default function DatePicker() {
    const datePickerRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!datePickerRef.current) return;

        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 6);

        const fp = flatpickr(datePickerRef.current, {
            mode: "range",
            static: true,
            monthSelectorType: "static",
            dateFormat: "M d",
            defaultDate: [sevenDaysAgo, today],
            clickOpens: true,
            prevArrow:
                '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 15L7.5 10L12.5 5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
            nextArrow:
                '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 15L12.5 10L7.5 5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        });

        return () => {
            if (!Array.isArray(fp)) {
                fp.destroy();
            }
        };
    }, []);


    return (
        <div className="relative inline-flex items-center">
            <CalenderIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:left-3 lg:top-1/2 lg:translate-x-0 lg:-translate-y-1/2 size-5 text-gray-500 dark:text-gray-400 pointer-events-none z-10" />
            <input
                ref={datePickerRef}
                className="h-10 w-10 lg:w-40 lg:h-auto  lg:pl-10 lg:pr-3 lg:py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-transparent lg:text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:lg:text-gray-300 cursor-pointer"
                placeholder="Select date range"
            />
        </div>
    )

}