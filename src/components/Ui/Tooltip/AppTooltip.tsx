import { useEffect, useState } from "react";

const getTooltipTarget = (target) => {
    return target instanceof Element ? target.closest("[data-pr-tooltip]") : null;
};

const AppTooltip = () => {
    const [tooltip, setTooltip] = useState(null);

    useEffect(() => {
        let timeoutId = null;

        const showTooltip = (event) => {
            const target = getTooltipTarget(event.target);
            const text = target?.getAttribute("data-pr-tooltip");
            if (!target || !text) return;

            window.clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => {
                const rect = target.getBoundingClientRect();
                const position = target.getAttribute("data-pr-position") || "top";
                setTooltip({ text, rect, position });
            }, 220);
        };

        const hideTooltip = () => {
            window.clearTimeout(timeoutId);
            setTooltip(null);
        };

        document.addEventListener("mouseover", showTooltip);
        document.addEventListener("focusin", showTooltip);
        document.addEventListener("mouseout", hideTooltip);
        document.addEventListener("focusout", hideTooltip);
        document.addEventListener("mousedown", hideTooltip);
        document.addEventListener("scroll", hideTooltip, true);

        return () => {
            window.clearTimeout(timeoutId);
            document.removeEventListener("mouseover", showTooltip);
            document.removeEventListener("focusin", showTooltip);
            document.removeEventListener("mouseout", hideTooltip);
            document.removeEventListener("focusout", hideTooltip);
            document.removeEventListener("mousedown", hideTooltip);
            document.removeEventListener("scroll", hideTooltip, true);
        };
    }, []);

    if (!tooltip) return null;

    const { rect, position, text } = tooltip;
    const coordinates = {
        top: {
            left: rect.left + rect.width / 2,
            top: rect.top - 10,
            transform: "translate(-50%, -100%)",
        },
        bottom: {
            left: rect.left + rect.width / 2,
            top: rect.bottom + 10,
            transform: "translate(-50%, 0)",
        },
        left: {
            left: rect.left - 10,
            top: rect.top + rect.height / 2,
            transform: "translate(-100%, -50%)",
        },
        right: {
            left: rect.right + 10,
            top: rect.top + rect.height / 2,
            transform: "translate(0, -50%)",
        },
    };

    return (
        <div
            className={`ecosoft-tooltip ecosoft-tooltip-${position}`}
            style={coordinates[position] || coordinates.top}
        >
            {text}
        </div>
    );
};

export default AppTooltip;
