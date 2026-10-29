
import { test, expect } from '@playwright/test'

test('deve finalizar uma compra e limpar o carrinho', async ({ page }) => {
  // Abre a página inicial do Kurio
  await page.goto('http://localhost:5173/')

  // Aguarda o catálogo carregar
  await expect(page.getByText('Golden Ape')).toBeVisible()

  // Abre os detalhes do NFT
  await page.getByText('Golden Ape').click()

  // Adiciona o NFT ao carrinho
  await page.getByRole('button', {
    name: 'Adicionar ao carrinho',
  }).click()

  // Acessa o carrinho
  await page.getByRole('link', {
    name: /carrinho/i,
  }).click()

  // Confere o valor da compra
  await expect(page.locator('span').getByText('0.25 ETH')).toBeVisible()

  // Finaliza a compra
  await page.getByRole('button', {
    name: 'Finalizar compra',
  }).click()

  // Confere a página de confirmação
  await expect(page).toHaveURL(/\/confirmacao$/)

  await expect(
    page.getByRole('heading', { name: 'Pedido confirmado!' })
  ).toBeVisible()

  // Volta ao carrinho e verifica se está vazio
  await page.goto('http://localhost:5173/carrinho')

  await expect(
    page.getByText('Seu carrinho está vazio.')
  ).toBeVisible()
})
