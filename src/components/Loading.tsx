import CountUp from '@/components/CountUp';

export default function Loading() {
    return (
        <div className="fixed inset-0 bg-black flex items-end justify-end p-8 z-50">
            <div className="text-lime-400">
                <CountUp
                    from={0}
                    to={101}
                    separator=","
                    direction="up"
                    duration={1}
                    className="text-9xl font-bold"
                />
                <span className="text-9xl ml-1">%</span>
            </div>
        </div>
    );
}
