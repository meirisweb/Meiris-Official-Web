import React, { useCallback, useEffect, useState } from 'react'
import { Select, Spinner, Box } from '@sanity/ui'
import { StringInputProps, set, unset, useFormValue, useClient } from 'sanity'

export function CategoryDropdownInput(props: StringInputProps) {
  const { value, onChange } = props
  const language = useFormValue(['language']) as string | undefined
  const client = useClient({ apiVersion: '2023-01-01' })
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.fetch(`*[_type == "resourcesPage" && language == $lang][0].tabCategories`, { lang: language || 'en' })
      .then((res) => {
        setCategories(res || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [client, language])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const nextValue = event.currentTarget.value
      onChange(nextValue ? set(nextValue) : unset())
    },
    [onChange]
  )

  if (loading) {
    return <Box padding={2}><Spinner /></Box>
  }

  return (
    <Select value={value || ''} onChange={handleChange}>
      <option value="">-- Select a category --</option>
      {categories?.filter(Boolean).map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </Select>
  )
}
