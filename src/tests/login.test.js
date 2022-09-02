import React from 'react';
import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import App from '../App';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import tokenResponse from './helpers/mocks/token'
import fetch from './helpers/mocks/fetch'

const api = Promise.resolve({
    json: () => Promise.resolve(fetch),
    ok: true,
  });
  const mockAPI = jest.spyOn(global, 'fetch').mockImplementation(() => api);
  afterEach(() => jest.clearAllMocks());

describe('Teste da pagina de login.',
  () => {
    it('inicia a aplicação na página de login e na rota /.',
      () => {
        const { history } = renderWithRouterAndRedux(<App />);
        const { pathname } = history.location;
        expect(pathname).toBe('/');
        const emailTestId = screen.getByTestId('input-gravatar-email')
        expect(emailTestId).toBeInTheDocument();
        const nameTestId = screen.getByTestId('input-player-name')
        expect(nameTestId).toBeInTheDocument();
        const button = screen.getByTestId('btn-play')
        expect(button).toBeInTheDocument();
        expect(button).toBeDisabled();
    });

    it('o botão só habilita um usuario e e-mail digitados',
    () => {
        renderWithRouterAndRedux(<App />);
        const emailTestId = screen.getByTestId('input-gravatar-email')
        const button = screen.getByTestId('btn-play');
        const nameTestId = screen.getByTestId('input-player-name');
        expect(button).toBeDisabled();

        userEvent.type(emailTestId, 'email@teste.com');
        userEvent.type(nameTestId, '');
        expect(button).toBeDisabled();

        userEvent.type(emailTestId, 'email@teste.com');
        userEvent.type(nameTestId, 'nome');
        expect(button).toBeEnabled();
      });
      it('o acesso é liberado e o usuario e e-mail salvo na store.', async () => {
        const { store, history } = renderWithRouterAndRedux(<App />, '/');
        const validEmail = 'email@email.com'
        const emailTestId = screen.getByTestId('input-gravatar-email')
        const button = screen.getByTestId('btn-play');
        const nameTestId = screen.getByTestId('input-player-name');
        userEvent.type(emailTestId, validEmail);
        userEvent.type(nameTestId, 'nome');
        expect(button).toBeEnabled();
        userEvent.click(button);
        // await waitFor( () => {
        //   const carregando = screen.getByText('carregando...');
        //   expect(carregando).toBeInTheDocument();
        // }, {timeout: 5000 });
      expect(store.getState().user.email).toBe(validEmail);
      expect(store.getState().user.user).toBe('nome');
      // const { pathname } = history.location;
      // expect(pathname).toBe('/game');
       });
       it('o usuario é direcionado para página de configurações ao clicar no botão', () => {
        const { history } = renderWithRouterAndRedux(<App />, '/');
        const buttonSettings = screen.getByTestId('btn-settings');
        expect(buttonSettings).toBeEnabled();
        userEvent.click(buttonSettings);
        const { pathname } = history.location;
        expect(pathname).toBe('/settings');

       });
  });