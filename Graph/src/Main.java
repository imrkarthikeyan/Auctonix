import java.util.*;
public class Main
{
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter no of vertices: ");
        int v = sc.nextInt();
        System.out.print("Enter no of Edges: ");
        int e = sc.nextInt();
        System.out.print("It is Directed or Undirected ?");
        boolean d = sc.nextBoolean();

        Graph g = new Graph();
        g.Graph(v,d);
        for(int i = 1;i<=e;i++)
        {
            int s = sc.nextInt();
            int d1 = sc.nextInt();
            int w = sc.nextInt();
            g.addEdge(s,d1,w);
        }
        g.printMatrix();

    }
}
class Graph
{
    int vertex;
    int[][] adjMat;
    boolean Directed;
    void Graph(int vertex,boolean d)
    {
        this.vertex = vertex;
        adjMat = new int[vertex][vertex];
        Directed = d;
    }
    void addEdge(int source,int destination,int weight)
    {
        adjMat[source][destination] = weight;
        if(!(Directed))
        {
            adjMat[destination][source] = weight;
        }
    }
    void printMatrix()
    {
        for(int i = 0;i<vertex;i++)
        {
            for(int j = 0;j<vertex;j++)
            {
                System.out.print(adjMat[i][j]+" ");
            }
            System.out.println(" ");
        }
    }
}