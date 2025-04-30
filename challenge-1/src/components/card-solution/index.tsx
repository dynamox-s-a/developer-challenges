import { CardSolutionProps } from './types';

export function CardSolution({
  mainImage,
  iconImage,
  title,
  description,
  imagePosition = 'left',
  items,
}: CardSolutionProps) {
  const Content = () => (
    <div className="flex h-full flex-col justify-center gap-6">
      <div className="flex flex-col gap-4">
        <img src={iconImage} alt="" className="w-12 h-12" />
        <h3 className="text-2xl md:text-3xl">{title}</h3>
      </div>

      <div className="text-gray-600 space-y-4">
        {description && description}

        {items && items.length > 0 && (
          <ul className="space-y-2 mt-4">
            {items.map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-main">
                <span className="w-1.5 h-1.5 bg-main rounded-full" />
                {item}
              </li>
            ))}
          </ul>
        )}

        <div className="border-t-2 border-gray-200 mt-4" />

        <a
          href="https://dynamox.net/blog"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-main mt-4"
        >
          <span className="text-xl border rounded-full w-6 h-6 flex items-center justify-center bg-gray-50">
            +
          </span>
          <span className="font-medium">Leia mais</span>
        </a>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-4 lg:p-8 rounded-[12px] shadow-md">
      {imagePosition === 'left' ? (
        <>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img src={mainImage} alt="" className="w-full h-full object-cover" />
          </div>
          <Content />
        </>
      ) : (
        <>
          <Content />
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img src={mainImage} alt="" className="w-full h-full object-cover" />
          </div>
        </>
      )}
    </div>
  );
}
