import { FC, useEffect, useRef, useState } from 'react';

interface TextDisplayProps {
  text: string;
}

const TextDisplay: FC<TextDisplayProps> = ({ text }) => {
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Split the text into paragraphs first, then into words
  const paragraphs = text.split('\n\n');
  
  // Create a flat array of all words with paragraph markers
  const allWords: Array<{word: string, isParagraphBreak: boolean}> = [];
  paragraphs.forEach((paragraph, pIndex) => {
    // Add words from this paragraph
    const words = paragraph.split(' ').filter(w => w.trim().length > 0);
    words.forEach(word => {
      allWords.push({ word, isParagraphBreak: false });
    });
    
    // Add paragraph break marker (except after the last paragraph)
    if (pIndex < paragraphs.length - 1) {
      allWords.push({ word: '', isParagraphBreak: true });
    }
  });
  
  useEffect(() => {
    let currentIndex = 0;
    let isAnimating = true;
    
    const animateNextWord = () => {
      if (!isAnimating) return;
      
      if (currentIndex < allWords.length) {
        const currentWord = allWords[currentIndex];
        // Safety check to ensure the word exists
        if (currentWord) {
          setDisplayedWords(prev => [...prev, currentWord.word]);
          currentIndex++;
          animationRef.current = window.setTimeout(animateNextWord, 50);
        } else {
          // Skip invalid entries
          currentIndex++;
          animationRef.current = window.setTimeout(animateNextWord, 10);
        }
      } else {
        // Animation complete
        setIsComplete(true);
        isAnimating = false;
      }
    };
    
    // Start animation
    if (allWords.length > 0) {
      animateNextWord();
    } else {
      // If there are no words, just mark as complete
      setIsComplete(true);
    }
    
    // Cleanup function
    return () => {
      isAnimating = false;
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []); // Empty dependency array ensures this only runs once
  
  // After animation completes, show editable content
  if (isComplete) {
    return (
      <div
        contentEditable={true}
        className="min-h-[200px] focus:outline-none text-black text-2xl leading-relaxed"
        style={{
          caretColor: '#007AFF',
          fontFamily: '-apple-system, BlinkMacSystemFont, SF Pro Display, SF Pro Text, system-ui, sans-serif',
          lineHeight: '1.6',
          wordWrap: 'break-word',
          whiteSpace: 'pre-wrap'
        }}
        suppressContentEditableWarning={true}
      >
        {paragraphs.map((paragraph, i) => (
          <div key={`p-${i}`}>
            {paragraph}
            {i < paragraphs.length - 1 && <br />}
          </div>
        ))}
      </div>
    );
  }
  
  // During animation, show animated words
  return (
    <div
      ref={containerRef}
      className="min-h-[200px] focus:outline-none text-black text-2xl leading-relaxed"
      style={{
        caretColor: '#007AFF',
        fontFamily: '-apple-system, BlinkMacSystemFont, SF Pro Display, SF Pro Text, system-ui, sans-serif',
        lineHeight: '1.6',
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap'
      }}
    >
      {allWords.slice(0, displayedWords.length).map((item, index) => {
        if (!item) return null;
        
        if (item.isParagraphBreak) {
          return <br key={`break-${index}`} />;
        }
        
        // Determine if we need a space before this word
        const needsSpace = index > 0 && 
                          allWords[index-1] && 
                          !allWords[index-1].isParagraphBreak;
        
        return (
          <span
            key={`word-${index}`}
            style={{
              opacity: '0',
              animation: 'fadeIn 0.5s ease-in-out forwards',
              animationDelay: `${index * 0.05}s`,
              display: 'inline-block'
            }}
          >
            {needsSpace ? ' ' : ''}
            {item.word}
          </span>
        );
      })}
    </div>
  );
};

export default TextDisplay;
