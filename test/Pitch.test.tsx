import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Pitch, { PitchProps } from '../src/Pitch'; // コンポーネントのパスを適切に設定してください
import { baseProps } from '../src/data/testData'

describe('Pitch Component', () => {
    it('renders without crashing', () => {
        const { getByTestId } = render(<Pitch {...baseProps as PitchProps} />)
        expect(getByTestId('Field')).toBeInTheDocument()
    })

    it('handles drag events', () => {
        const { getByTestId } = render(<Pitch {...baseProps as PitchProps} />);
        const playerId = `${baseProps.home.name}_${baseProps.home.startingPlayers[0].id}`
        const playerIcon = getByTestId(playerId)

        fireEvent.mouseDown(playerIcon);
        expect(playerIcon).toBeInTheDocument()
    })
})
