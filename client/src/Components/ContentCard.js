const ContentCard = ({ content, onDelete }) => (
  <div
    className="flex justify-between bg-white p-6 rounded-md shadow-md"
    key={content.id}
  >
    <div>
      <h2 className="text-xl font-bold mb-4">{content.title}</h2>
      <p className="text-gray-600">{content.description}</p>
      {content.file || content.fileLink ? (
        <div className="mt-4">
          <a
            href={content.file || content.fileLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            View Content
          </a>
        </div>
      ) : null}
    </div>
    <div
      onClick={() => onDelete(content.id)}
      className="text-2xl cursor-pointer"
    >
      🗑️
    </div>
  </div>
);

export default ContentCard;
