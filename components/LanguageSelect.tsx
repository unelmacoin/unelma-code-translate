import type { FC } from 'react';

interface Props {
  language: string;
  onChange: (language: string) => void;
  isDark:boolean;
}

export const LanguageSelect: FC<Props> = ({ language, onChange ,isDark}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
    
  };
  const bg = isDark ? 'bg-[#1F2937]': 'bg-[#fff]';
  const text = isDark ? 'text-neutral-200': 'text-black';

  return (
    <select
      className = {`w-full rounded-md px-4 py-2 ${bg} ${text} transition-all duration-300`}
      value={language}
      onChange={handleChange}
    >
      {languages
        .sort((a, b) => a.id - b.id)
        .map((language) => (
          <option key={language.id} value={language.value}>
            {language.label}
          </option>
        ))}
    </select>
  );
};

const languages = [
  { id: 1, value: 'Natural Language', label: 'Natural Language' },
  { id: 2, value: 'Pascal', label: 'Pascal' },
  { id: 3, value: 'JavaScript', label: 'JavaScript' },
  { id: 4, value: 'TypeScript', label: 'TypeScript' },
  { id: 5, value: 'Python', label: 'Python' },
  { id: 6, value: 'TSX', label: 'TSX' },
  { id: 7, value: 'JSX', label: 'JSX' },
  { id: 8, value: 'Vue', label: 'Vue' },
  { id: 9, value: 'Go', label: 'Go' },
  { id: 10, value: 'C', label: 'C' },
  { id: 11, value: 'C++', label: 'C++' },
  { id: 12, value: 'CoffeeScript', label: 'CoffeeScript' },
  { id: 13, value: 'Java', label: 'Java' },
  { id: 14, value: 'C#', label: 'C#' },
  { id: 15, value: 'Visual Basic .NET', label: 'Visual Basic .NET' },
  { id: 16, value: 'SQL', label: 'SQL' },
  { id: 17, value: 'Assembly Language', label: 'Assembly Language' },
  { id: 18, value: 'PHP', label: 'PHP' },
  { id: 19, value: 'Ruby', label: 'Ruby' },
  { id: 20, value: 'Swift', label: 'Swift' },
  { id: 21, value: 'Kotlin', label: 'Kotlin' },
  { id: 22, value: 'R', label: 'R' },
  { id: 23, value: 'Objective-C', label: 'Objective-C' },
  { id: 24, value: 'Perl', label: 'Perl' },
  { id: 25, value: 'Scala', label: 'Scala' },
  { id: 26, value: 'Dart', label: 'Dart' },
  { id: 27, value: 'Rust', label: 'Rust' },
  { id: 28, value: 'Haskell', label: 'Haskell' },
  { id: 29, value: 'Lua', label: 'Lua' },
  { id: 30, value: 'Groovy', label: 'Groovy' },
  { id: 31, value: 'Elixir', label: 'Elixir' },
  { id: 32, value: 'Clojure', label: 'Clojure' },
  { id: 33, value: 'Lisp', label: 'Lisp' },
  { id: 34, value: 'Julia', label: 'Julia' },
  { id: 35, value: 'Matlab', label: 'Matlab' },
  { id: 36, value: 'Fortran', label: 'Fortran' },
  { id: 37, value: 'COBOL', label: 'COBOL' },
  { id: 38, value: 'Bash', label: 'Bash' },
  { id: 39, value: 'Powershell', label: 'Powershell' },
  { id: 40, value: 'PL/SQL', label: 'PL/SQL' },
  { id: 41, value: 'CSS', label: 'CSS' },
  { id: 42, value: 'Racket', label: 'Racket' },
  { id: 43, value: 'HTML', label: 'HTML' },
  { id: 44, value: 'NoSQL', label: 'NoSQL' },
  { id: 45, value: 'YAML', label: 'YAML' },
  { id: 46, value: 'ZIG', label: 'Zig' }
];