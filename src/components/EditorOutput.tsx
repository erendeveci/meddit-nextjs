import dynamic from "next/dynamic";
import React from "react";

const Output = dynamic(async () => (await import("editorjs-react-renderer")).default, {
  ssr: false,
});

interface EditorOutputProps {
  content: any;
}
const style = {
  paragraph: {
    fontSize: "0.0875rem",
    lineHeight: "1.25rem",
  },
};
const renderers = {
  code: CustomCodeRenderer,
};

const EditorOutput: React.FC<EditorOutputProps> = ({ content }) => {
  return (
    // @ts-expect-error
    <Output data={content} className="text-sm" renderers={renderers} />
  );
};

function CustomCodeRenderer({ data }: any) {
  return (
    <pre className="bg-gray-800 rounded-md p-4">
      <code className="text-gray-100 text-sm">{data.code}</code>
    </pre>
  );
}

export default EditorOutput;
