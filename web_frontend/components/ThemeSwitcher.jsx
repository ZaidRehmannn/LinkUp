import React from 'react'
import { Switch } from './ui/switch'
import { useTheme } from 'next-themes'

const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme()

    return (
        <Switch
            checked={theme === 'dark'}
            onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="cursor-pointer data-[state=checked]:bg-blue-500"
        />
    )
}

export default ThemeSwitcher
