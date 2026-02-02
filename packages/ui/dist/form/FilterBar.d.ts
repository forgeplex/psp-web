import React from 'react';
export interface FilterBarProps {
    children?: React.ReactNode;
    searchPlaceholder?: string;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    onSearch?: (value: string) => void;
    onReset?: () => void;
    extra?: React.ReactNode;
}
export declare function FilterBar({ children, searchPlaceholder, searchValue, onSearchChange, onSearch, onReset, extra, }: FilterBarProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=FilterBar.d.ts.map