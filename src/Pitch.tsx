"use client"
import React, { useState, useRef, useEffect } from 'react';
import style from './Pitch.module.css';

const MAX_WIDTH = 120
const MAX_HEIGHT = 90
const MARGIN = 4

export type Team = {
    name: string
    formation: number[]
    startingPlayers: Player[]
    substitute: Player[]
}

export type Player = {
    id: number
    name: string
    number: number
    pos: "GK" | "DF" | "MF" | "FW"
    x: number
    y: number
    color: PlayerColor
}

export type PlayerColor = {
    primary: string
    border: string
    number: string
}

export type PitchProps = {
    home: Team
    away: Team
}

export type PitchPlayer = {
    id: string
    number: number
    name: string
    x: number
    y: number,
    color: PlayerColor
}

type PlayerIconProps = {
    id: string
    number: number
    name: string
    x: number
    y: number,
    color: PlayerColor
    onDrag: (event: React.MouseEvent<SVGCircleElement, MouseEvent>, id: string) => void
}

const PlayerIcon = (props: PlayerIconProps) => {
    const handleMouseDown = (event: React.MouseEvent<SVGCircleElement, MouseEvent>) => {
        props.onDrag(event, props.id);
    };

    return (
        <>
            <circle
                id={props.id}
                cx={props.x}
                cy={props.y}
                r="2"
                fill={`#${props.color.primary}`}
                stroke={`#${props.color.border}`}
                strokeWidth={0.4}
                className="playerIcon"
            />
            <text x={props.x} y={props.y} text-anchor="middle" fontSize={2} dy=".3em" color={`#${props.color.number}`}>{props.number}</text>
            {/* name
                <text x={props.x} y={props.y + 3} text-anchor="middle" fontSize={1.5} color={`#${props.color.number}`}>{props.name}</text>
            */}
            <circle
                id={props.id}
                cx={props.x}
                cy={props.y}
                r="2"
                opacity={0}
                className="playerIcon"
                onMouseDown={handleMouseDown}
            />
        </>
    );
};

const Picth = (props: PitchProps) => {
    const [homePitchPlayers, setHomePitchPlayers] = useState<PitchPlayer[]>([])
    const [awayPitchPlayers, setAwayPitchPlayers] = useState<PitchPlayer[]>([])
    const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const onDrag = (event: React.MouseEvent<SVGCircleElement, MouseEvent>, id: string) => {
        setSelectedPlayer(id);
    };

    const onDragMove = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        if (selectedPlayer && svgRef.current) {
            const CTM = svgRef.current.getScreenCTM();
            if (CTM) {
                const transformedPoint = svgRef.current.createSVGPoint();
                transformedPoint.x = event.clientX;
                transformedPoint.y = event.clientY;
                const cursorPoint = transformedPoint.matrixTransform(CTM.inverse());
                const tmpHomePitchPlayers = homePitchPlayers
                setHomePitchPlayers(
                    homePitchPlayers.map(player =>
                        player.id === selectedPlayer ? { ...player, x: cursorPoint.x, y: cursorPoint.y } : player
                    )
                );
                setAwayPitchPlayers(
                    awayPitchPlayers.map(player =>
                        player.id === selectedPlayer ? { ...player, x: cursorPoint.x, y: cursorPoint.y } : player
                    )
                )
            }
        }
    };

    const onDragEnd = () => {
        setSelectedPlayer(null);
    };

    const tranformPlayerPosition = (
        formation: number[],
        player: Player,
        isHome: boolean,
    ) => {
        console.log(formation)
        const samePositionPlayerNumber = player.pos == 'GK' ? 1 : formation[player.x - 2]
        const dividePitchNumber = samePositionPlayerNumber + 1
        const x = ((MAX_WIDTH / 2 - (MARGIN * 2)) / (formation.length + 1)) * (player.x)
        const y = MAX_HEIGHT / dividePitchNumber * player.y
        return {
            id: `${player.id}`,
            number: player.number,
            name: player.name,
            x: isHome ? x : MAX_WIDTH - x,
            y: isHome ? y : MAX_HEIGHT - y,
            color: player.color
        }
    }

    useEffect(() => {
        const transformedHomePlayer = props.home.startingPlayers?.map(
            h => tranformPlayerPosition(props.home.formation, h, true)
        );
        const transformedAwayPlayer = props.away.startingPlayers?.map(
            h => tranformPlayerPosition(props.home.formation, h, false)
        );
        setHomePitchPlayers(transformedHomePlayer);
        setAwayPitchPlayers(transformedAwayPlayer);
    }, [props.home.startingPlayers, props.away.startingPlayers, props.home.formation]);



    return (
        <svg
            className={style.soccerField}
            ref={svgRef}
            viewBox="0 0 120 90"
            xmlns="http://www.w3.org/2000/svg"
            onMouseMove={onDragMove}
            onMouseUp={onDragEnd}
            onMouseLeave={onDragEnd}
        >
            {/* フィールドの背景 */}
            <rect x="0" y="0" width="120" height="90" fill="green" />
            {/* センターサークル */}
            <circle cx="60" cy="45" r="9.15" fill="none" stroke="white" />
            <circle cx="60" cy="45" r="0.8" fill="white" />
            {/* センターライン */}
            <line x1="60" y1="0" x2="60" y2="90" stroke="white" />
            {/* ペナルティエリア */}
            <rect x="0" y="20.25" width="16.5" height="49.5" fill="none" stroke="white" />
            <rect x="103.5" y="20.25" width="16.5" height="49.5" fill="none" stroke="white" />
            <rect x="0" y="34.25" width="5.5" height="21.5" fill="none" stroke="white" />
            <rect x="114.5" y="34.25" width="5.5" height="21.5" fill="none" stroke="white" />
            {
                homePitchPlayers.map((player) => (
                    <PlayerIcon key={player.id} {...player} onDrag={onDrag} />
                ))
            }
            {
                awayPitchPlayers.map((player) => (
                    <PlayerIcon key={player.id} {...player} onDrag={onDrag} />
                ))
            }
        </svg>
    );
};

export default Picth;
