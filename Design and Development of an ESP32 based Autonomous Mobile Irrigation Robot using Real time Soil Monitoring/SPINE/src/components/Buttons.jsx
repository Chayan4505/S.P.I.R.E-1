export const PrimaryButton = ({ children, className, ...props }) => (
    <button type="button" className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-medium bg-linear-to-br from-green-400 to-green-700 hover:opacity-90 active:scale-95 transition-all ${className}`} {...props} >
        {children}
    </button>
);

export const GhostButton = ({ children, className, ...props }) => (
    <button type="button" className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border border-black/60 bg-black/3 hover:bg-white/6 backdrop-blur-sm active:scale-95 transition ${className}`} {...props} >
        {children}
    </button>
);