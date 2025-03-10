import { Link } from "react-router-dom";

export default function BottomWarning({label, bottomText, to}) {
    return <div className="py-2 text-sm flex justify-center text-slate-700">
        <div>
            {label}
        </div>
        <Link className="pointer underline pl-1 cursor-pointer" to={to}>
            {bottomText}
        </Link>

    </div>
}