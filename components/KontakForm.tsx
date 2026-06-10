export default function KontakForm() {
  const units = [
    {
      name: 'RA Al Jawahir',
      wa: '62812XXXXXXXX',
      label: 'TK / RA',
      icon: '🌙',
    },
    {
      name: 'SD IT Al Jawahir',
      wa: '62812XXXXXXXX',
      label: 'SD IT',
      icon: '📚',
    },
    {
      name: 'SMP IT Al Jawahir',
      wa: '62812XXXXXXXX',
      label: 'SMP IT',
      icon: '🎓',
    },
    {
      name: 'Taman Pendidikan Al-Quran',
      wa: '62812XXXXXXXX',
      label: 'TPA',
      icon: '🕌',
    },
  ]

  return (
    <div className="flex flex-col items-center gap-3">
      {units.map((u, i) => (
        <a
          key={i}
          href={`https://wa.me/${u.wa}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center gap-2 md:gap-3 bg-white border-2 border-green-100 hover:border-green-400 text-gray-700 hover:text-green-800 p-2.5 md:p-3.5 rounded-xl no-underline hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-md group"
        >
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-green-50 flex items-center justify-center text-base md:text-lg flex-shrink-0 group-hover:bg-green-100 transition-colors">
            {u.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-xs md:text-sm truncate">{u.name}</p>
            <p className="text-[11px] md:text-xs text-gray-400 group-hover:text-green-600 transition-colors">{u.label}</p>
          </div>
        </a>
      ))}
      <p className="text-xs text-gray-400 text-center pt-1">Senin–Jumat 07.30–15.30 WIB</p>
    </div>
  )
}
