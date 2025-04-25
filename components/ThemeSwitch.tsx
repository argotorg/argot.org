'use client'

import { Fragment, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Menu, RadioGroup, Transition } from '@headlessui/react'
import { BiSun, BiMoon, BiLaptop } from 'react-icons/bi'

const themeOptions = [
  { value: 'light', label: 'Light', icon: BiSun },
  { value: 'dark', label: 'Dark', icon: BiMoon },
  { value: 'system', label: 'System', icon: BiLaptop },
]

const ThemeOption = ({ option }: { option: (typeof themeOptions)[0] }) => {
  const Icon = option.icon
  return (
    <button className="group flex w-full items-center rounded-md px-2 py-2 text-sm text-anthracite-700 hover:bg-amber-500 hover:text-white dark:text-ecru-300 dark:hover:bg-amber-500 dark:hover:text-white">
      <div className="mr-2">
        <Icon className="h-5 w-5" />
      </div>
      {option.label}
    </button>
  )
}

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])

  return (
    <div className="mr-5 flex items-center">
      <Menu as="div" className="relative inline-block text-left">
        <div className="flex items-center justify-center hover:text-amber-500 dark:hover:text-amber-400">
          <Menu.Button aria-label="Theme switcher">
            {mounted ? (
              resolvedTheme === 'dark' ? (
                <BiMoon className="h-6 w-6" />
              ) : (
                <BiSun className="h-6 w-6" />
              )
            ) : (
              <div className="h-6 w-6" />
            )}
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-50 mt-2 w-32 origin-top-right rounded-md bg-ecru-300 shadow-lg focus:outline-none dark:bg-anthracite-600">
            <RadioGroup value={theme} onChange={setTheme}>
              <div className="p-1">
                {themeOptions.map((option) => (
                  <RadioGroup.Option key={option.value} value={option.value}>
                    <Menu.Item>{() => <ThemeOption option={option} />}</Menu.Item>
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default ThemeSwitch
