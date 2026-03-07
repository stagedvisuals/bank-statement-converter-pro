// Helper functie om Excel te downloaden vanuit de frontend
export async function downloadExcel(
  transactions: any[],
  filename: string = 'transacties.xlsx'
): Promise<void> {
  try {
    const response = await fetch('/api/export/excel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactions,
        filename
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Excel export mislukt')
    }

    // Download het bestand
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

  } catch (error) {
    console.error('Download error:', error)
    throw error
  }
}

// Voorbeeld gebruik:
// const transactions = [
//   { datum: '2024-01-15', omschrijving: 'Test', bedrag: -50.00, saldo_na: 1000.00, type: 'Betaalautomaat', categorie: 'Boodschappen', btw_percentage: 21, confidence_score: 0.95 }
// ]
// await downloadExcel(transactions, 'mijn-transacties.xlsx')
