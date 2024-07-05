interface GeneratedTitlesProps {
  titles: string[];
}

function GeneratedTitles(props: GeneratedTitlesProps) {
  return (
    <div className="my-4 rounded-lg border border-yellow-400 bg-yellow-200 p-6 shadow-lg">
      <h2 className="mb-4 text-2xl font-bold text-gray-800">生成結果</h2>
      <ul className="list-inside list-disc text-lg font-semibold text-gray-800">
        {props.titles.map((title, index) => (
          <li key={index} className="mt-2">
            {title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GeneratedTitles;
