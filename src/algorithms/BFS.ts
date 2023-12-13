import { Vector2 } from "../dataStructures";

const DefaultDirections = [new Vector2(0, 1), new Vector2(0, -1), new Vector2(1, 0), new Vector2(-1, 0)];

export type Node = {
    Position: Vector2;
    Distance: number;
}

// Configuration - Allows the calling function to configure how BFS will run.
export type Config = {
    GetValidDirections?: (position: Vector2) => Vector2[];
    CheckNode?: (node: Node) => boolean;
    GetDistance?: (node: Node, direction: Vector2) => number;
}

// Internal - object so that every function will be defined.
type Configured = {
    GetValidDirections: (position: Vector2) => Vector2[];
    CheckNode: (node: Node) => boolean;
    GetDistance: (node: Node, direction: Vector2) => number;
}

// Configures the program; either defines the function as a default, or uses the configuration if one has been provided.
function Configure(config: Config | undefined): Configured {
    let getDistance = config?.GetDistance === undefined ? (n: Node) => n.Distance + 1 : config.GetDistance;
    let checkNode = config?.CheckNode === undefined ? ()=>true : config.CheckNode;
    let getValidDirections = config?.GetValidDirections === undefined ? ()=>DefaultDirections : config.GetValidDirections;

    return {
        GetValidDirections: getValidDirections,
        GetDistance: getDistance,
        CheckNode: checkNode
    }
}

export function BFSArray(startPositions: Vector2[], values: any[][], configuration?: Config | undefined): Node[] {
    let config = Configure(configuration);

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
        let currentNode = targetNodes[index];
        let currentPosition = currentNode.Position;
        
        // Check the node, and exit early if we're done
        if (config.CheckNode(currentNode) === false) {
            break;
        }

        // Calculate all nodes to move to
        let directions = config.GetValidDirections(currentPosition);
        directions.forEach(direction => {
            let newPosition = currentPosition.Add(direction.X, direction.Y);
            if (visited.has(newPosition.ToString()) || !isWithinGrid(newPosition)) {
                return;
            }

            targetNodes.push({
                Position: newPosition,
                Distance: config.GetDistance(currentNode, direction)
            });
            visited.add(newPosition.ToString());
        });
    }

    return targetNodes;
}

export function BFS(startPosition: Vector2, values: any[][], config?: Config): Node[] {
    return BFSArray([startPosition], values, config);
}