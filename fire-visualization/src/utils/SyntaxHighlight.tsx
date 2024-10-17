// third-party
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import SyntaxHighlighter, { SyntaxHighlighterProps } from 'react-syntax-highlighter';

// ==============================|| CODE HIGHLIGHTER ||============================== //

export const SyntaxHighlight = ({ children, ...others }: SyntaxHighlighterProps) => {
  return (
    <SyntaxHighlighter
      language="javacript"
      showLineNumbers
      style={a11yDark}
      {...others}
    >
      {children}
    </SyntaxHighlighter>
  );
};
