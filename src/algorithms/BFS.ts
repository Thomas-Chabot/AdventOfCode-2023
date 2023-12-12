import { Vector2 } from "../dataStructures";

const DefaultDirections = [new Vector2(0, 1), new Vector2(1, 0), new Vector2(1, 0), new Vector2(-1, 0)];

export type Node = {
    Position: Vector2;
    Distance: number;
}

export function BFSArray(startPositions: Vector2[], values: any[][], getValidDirections?: (position: Vector2)=>Vector2[]): Node[] {
    if (getValidDirections === undefined) {
        getValidDirections = ()=>DefaultDirections;
    }

    let targetNodes: Node[] = [ ];
    let visited = new Set<string>();

    // Start by building up the Target Nodes
    startPositions.forEach(position => {
        targetNodes.push({
            Position: position,
            Distance: 0
        });
        visited.add(position.ToString());
    })

    let isWithinGrid = (position: Vector2) => {
        return position.X >= 0 &&
               position.X < values[0].length &&
               position.Y >= 0 &&
               position.Y < values[position.X].length;
    }

    // Go through every target
    for (let index = 0; index < targetNodes.length; index++) {
        let currentPosition = targetNodes[index].Position;
        let directions = getValidDirections(currentPosition);
        directions.forEach(direction => {
            let newPosition = currentPosition.Add(direction.X, direction.Y);
            if (visited.has(newPosition.ToString()) || !isWithinGrid(newPosition)) {
                return;
            }

            targetNodes.push({
                Position: newPosition,
                Distance: targetNodes[index].Distance + 1
            });
            visited.add(newPosition.ToString());
        });
    }

    return targetNodes;
}

export function BFS(startPosition: Vector2, values: any[][], getValidDirections?: (position: Vector2)=>Vector2[]): Node[] {
    return BFSArray([startPosition], values, getValidDirections);
}