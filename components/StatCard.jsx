export default function StatCard({ id, value, label, bg, textColor, style }) {
    return (
        <div
            id={id}
            className="stat-card absolute z-10 flex flex-col items-start rounded-xl"
            style={{
                background: bg,
                color: textColor,
                opacity: 0,
                padding: "28px 30px",
                minWidth: 200,
                ...style,
            }}
        >
            <span
                className="leading-none"
                style={{ fontSize: 58, fontWeight: 600 }}
            >
                {value}
            </span>
            <span className="text-base font-medium leading-snug mt-2">{label}</span>
        </div>
    );
}
