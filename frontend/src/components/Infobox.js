import React from 'react';

const Infobox = ({ title, image, data }) => {
  return (
    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-6 float-left ml-6 w-80">
      {/* Title */}
      <h3 className="text-xl font-bold text-center mb-3 pb-2 border-b-2 border-primary-600">
        {title}
      </h3>

      {/* Image */}
      {image && (
        <div className="mb-3">
          <img
            src={image.url}
            alt={image.alt || title}
            className="w-full rounded-lg"
          />
          {image.caption && (
            <p className="text-xs text-gray-600 text-center mt-2">{image.caption}</p>
          )}
        </div>
      )}

      {/* Data Rows */}
      <table className="w-full text-sm">
        <tbody>
          {data && data.map((row, index) => (
            <tr key={index} className="border-b border-gray-200">
              <th className="text-right py-2 px-2 bg-gray-100 font-semibold text-gray-700 align-top">
                {row.label}
              </th>
              <td className="py-2 px-2 text-gray-800">
                {Array.isArray(row.value) ? (
                  <ul className="list-none">
                    {row.value.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  row.value
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Infobox;
