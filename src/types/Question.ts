export interface SelectedQuiz {
  id: string;
  title: string;
}
export interface OptionRowType {
  leftOption: string[];
  rightOption: string[];
}

export interface LeftOption {
  id: string;
  optionText: string;
}

export interface RightOption {
  id: string;
  optionAnswer: string;
}

export interface ColumnRowOption {
  id: string;
  optionPosition: string;
  optionText: string;
}

export interface FrontOptions {
  leftOptions: LeftOption[];
  rightOptions: RightOption[];
}
