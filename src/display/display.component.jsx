import "./display.styles.scss";

export const Display = ({ shortestPath }) => {
  const totalSteps = shortestPath.length - 1;

  return (
    <div className="display__pairs">
      <h1 className="display__title">Steps [Total: {totalSteps}]</h1>
      <table>
        {shortestPath.map((bucket, i) => (
          <tbody key={i}>
            <tr>
              <th>Bucket A</th>
              <th>Bucket B</th>
            </tr>
            <tr>
              <td>{bucket.small}</td>
              <td>{bucket.large}</td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
};
