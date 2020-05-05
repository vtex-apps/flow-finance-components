export function formatCNPJ(value: string | undefined) {
  if (!value) return ''
  const currentValue = value.replace(/[^\d]/g, '')
  const cvLength = currentValue.length

  if (cvLength < 3) return currentValue
  if (cvLength < 6)
    return `${currentValue.slice(0, 2)}.${currentValue.slice(2)}`
  if (cvLength < 9)
    return `${currentValue.slice(0, 2)}.${currentValue.slice(
      2,
      5
    )}.${currentValue.slice(5)}`
  if (cvLength < 13)
    return `${currentValue.slice(0, 2)}.${currentValue.slice(
      2,
      5
    )}.${currentValue.slice(5, 8)}/${currentValue.slice(8)}`
  return `${currentValue.slice(0, 2)}.${currentValue.slice(
    2,
    5
  )}.${currentValue.slice(5, 8)}/${currentValue.slice(
    8,
    12
  )}-${currentValue.slice(12)}`
}

export function formatCPF(value: string | undefined) {
  if (!value) return ''
  const currentValue = value.replace(/[^\d]/g, '')
  const cvLength = currentValue.length

  if (cvLength < 4) return currentValue
  if (cvLength < 7)
    return `${currentValue.slice(0, 3)}.${currentValue.slice(3)}`
  if (cvLength < 10)
    return `${currentValue.slice(0, 3)}.${currentValue.slice(
      3,
      6
    )}.${currentValue.slice(6)}`
  if (cvLength > 9)
    return `${currentValue.slice(0, 3)}.${currentValue.slice(
      3,
      6
    )}.${currentValue.slice(6, 9)}-${currentValue.slice(9)}`
  return ''
}

export function formatRG(value: string | undefined) {
  if (!value) return ''
  const currentValue = value.replace(/[^\d]/g, '')
  const cvLength = currentValue.length

  if (cvLength < 3) return currentValue
  if (cvLength < 4)
    return `${currentValue.slice(0, 2)}.${currentValue.slice(2)}`
  if (cvLength < 9)
    return `${currentValue.slice(0, 2)}.${currentValue.slice(
      2,
      5
    )}.${currentValue.slice(5)}`
  if (cvLength > 8)
    return `${currentValue.slice(0, 2)}.${currentValue.slice(
      2,
      5
    )}.${currentValue.slice(5, 8)}-${currentValue.slice(8)}`
  return ''
}

export function formatRGExp(value: string | undefined) {
  if (!value) return ''
  const currentValue = value.replace(/[^\d]/g, '')
  const cvLength = currentValue.length

  if (cvLength < 3) return currentValue
  if (cvLength < 4)
    return `${currentValue.slice(0, 2)}/${currentValue.slice(2)}`
  if (cvLength < 6)
    return `${currentValue.slice(0, 2)}/${currentValue.slice(
      2,
      4
    )}/${currentValue.slice(4)}`
  return ''
}

export function formatPhone(value: string | undefined) {
  if (!value) return ''
  const currentValue = value.replace(/[^\d]/g, '')
  const cvLength = currentValue.length

  if (cvLength < 3) return currentValue
  if (cvLength < 4)
    return `(${currentValue.slice(0, 2)}) ${currentValue.slice(2)}`
  if (parseInt(currentValue.slice(2, 3), 10) < 6) {
    if (cvLength < 7) {
      return `(${currentValue.slice(0, 2)}) ${currentValue.slice(2)}`
    }
    if (cvLength <= 10) {
      return `(${currentValue.slice(0, 2)}) ${currentValue.slice(
        2,
        6
      )}-${currentValue.slice(6)}`
    }
  }
  if (cvLength < 8) {
    return `(${currentValue.slice(0, 2)}) ${currentValue.slice(
      2,
      3
    )} ${currentValue.slice(3)}`
  }
  return `(${currentValue.slice(0, 2)}) ${currentValue.slice(
    2,
    3
  )} ${currentValue.slice(3, 7)}-${currentValue.slice(7)}`
}
