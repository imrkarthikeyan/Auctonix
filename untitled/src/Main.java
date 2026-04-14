//////import java.util.*;
//////class Graph{
//////    int vertices;
//////    boolean directed;
//////    int adjMat[][];
//////    Graph(int vertices,boolean directed){
//////        this.vertices=vertices;
//////        this.directed=directed;
//////        adjMat =new int[vertices][vertices];
//////    }
//////    void addEdge(int source,int dest,boolean directed){
//////        adjMat[source][dest]=1;
//////        if(!directed)
//////            adjMat[dest][source]=1;
//////    }
//////    void printMat(){
//////        for(int i=0;i<vertices;i++){
//////            for(int j=0;j<vertices;j++){
//////                System.out.print(adjMat[i][j]+" ");
//////            }
//////            System.out.println(" ");
//////        }
//////    }
//////    void dfs(int start){
//////        boolean visited[]=new boolean[vertices];
//////        System.out.println("DFS Traversal:");
//////        dfshelper(start,visited);
//////    }
//////    void dfshelper(int start,boolean[]visited){
//////        visited[start]=true;
//////        System.out.println(start+" ");
//////        for(int i=0;i<vertices;i++){
//////            if(adjMat[start][i]>=1&& !visited[i]){
//////                dfshelper(i,visited);
//////            }
//////        }
//////    }
//////
//////    void bfs(int start){
//////        boolean visited[]=new boolean[vertices];
//////        Queue<Integer> q=new LinkedList<>();
//////        q.add(start);
//////        visited[start]=true;
//////        System.out.println("BFS Traversal:");
//////        while(!q.isEmpty()){
//////            int curr=q.poll();
//////            System.out.println(curr+" ");
//////            for(int i=0;i<vertices;i++){
//////                if(adjMat[curr][i]>=1 && !visited[i]){
//////                    q.add(i);
//////                    visited[i]=true;
//////                }
//////            }
//////        }
//////    }
//////}
//////
//////public class Main {
//////    public static void main(String[] args) {
//////        Scanner scan=new Scanner(System.in);
//////        System.out.println("Enter no of vertices: ");
//////        int vertices= scan.nextInt();
//////        System.out.println("Directed?");
//////        boolean direction =scan.nextBoolean();
//////
//////        Graph obj=new Graph(vertices,direction);
//////        System.out.println("Enter no od edges: ");
//////        int edge= scan.nextInt();
//////        for(int i=0;i<edge;i++){
//////            int s= scan.nextInt();
//////            int d= scan.nextInt();
//////            obj.addEdge(s,d,direction);
//////        }
//////        obj.printMat();
//////    }
//////
//////}
////
////
////
////////DFS
////import java.util.*;
////public class Main
////{
////    public static void main(String[] args) {
////        Scanner sc = new Scanner(System.in);
////        System.out.print("Enter no of vertices: ");
////        int v = sc.nextInt();
////        System.out.print("Enter no of Edges: ");
////        int e = sc.nextInt();
////        System.out.print("It is Directed or Undirected ?");
////        boolean d = sc.nextBoolean();
////
////        Graph g = new Graph();
////        g.Graph(v,d);
////        for(int i = 1;i<=e;i++)
////        {
////            int s = sc.nextInt();
////            int d1 = sc.nextInt();
////            int w = sc.nextInt();
////            g.addEdge(s,d1,w);
////        }
////        g.printMatrix();
////        g.dfs(0);
////        g.bfs(0);
////    }
////}
////class Graph
////{
////    int vertex;
////    int[][] adjMat;
////    boolean Directed;
////    void Graph(int vertex,boolean d)
////    {
////        this.vertex = vertex;
////        adjMat = new int[vertex][vertex];
////        Directed = d;
////    }
////    void addEdge(int source,int destination,int weight)
////    {
////        adjMat[source][destination] = weight;
////        if(!(Directed))
////        {
////            adjMat[destination][source] = weight;
////        }
////    }
////    void printMatrix()
////    {
////        for(int i = 0;i<vertex;i++)
////        {
////            for(int j = 0;j<vertex;j++)
////            {
////                System.out.print(adjMat[i][j]+" ");
////            }
////            System.out.println(" ");
////        }
////    }
////    void dfs(int start)
////    {
////        boolean[] visited = new boolean[vertex];
////        System.out.print("DFS Traversal: ");
////        dfshelper(start,visited);
////        System.out.println();
////    }
////
////    void bfs(int start){
////        boolean[] visited=new boolean[vertex];
////        Queue<Integer> q=new LinkedList<>();
////        q.add(start);
////        visited[start]=true;
////        System.out.println("BFS Traversal");
////        while(!q.isEmpty()){
////            int node=q.poll();
////            System.out.print(node+" ");
////            for(int i=0;i<vertex;i++){
////                if(adjMat[node][i]>=1 && !visited[i]){
////                    q.add(1);
////                    visited[i]=true;
////                }
////            }
////        }
////    }
////
////    void dfshelper(int start,boolean[] visited)
////    {
////        visited[start] = true;
////        System.out.print(start+" ");
////
////        for(int i = 0;i<vertex;i++)
////        {
////            if(adjMat[start][i]>0 && !visited [i])
////            {
////                dfshelper(i,visited);
////            }
////        }
////    }
////}
//
//
//import java.util.ArrayList;
//import java.util.Scanner;
//
//class Graph{
//    int vertices;
//    ArrayList<ArrayList<Integer>> arr;
//    Graph(int vertices){
//        this.vertices=vertices;
//        arr=new ArrayList<>();
//
//        for(int i=0;i<vertices;i++){
//            arr.add(new ArrayList<>());
//        }
//    }
//    void addEdge(int sourse,int dest){
//        arr.get(sourse).add(dest);
//        arr.get(dest).add(sourse);
//    }
//
//    void printlst(){
//        for(int i=0;i<vertices;i++){
//
//        }
//    }
//}
//
//public class Main{
//    public static void main(String[] args){
//        Scanner sc=new Scanner(System.in);
//        System.out.println("Enter no of vertices :");
//        int v=sc.nextInt();
//        System.out.print("Enter no of edges :");
//        int e=sc.nextInt();
//    }
//}




import java.util.*;

class Graph {
    int vertices;
    ArrayList<ArrayList<Integer>> adj;
    boolean directed;

    Graph(int vertices, boolean directed) {
        this.vertices = vertices;
        this.directed = directed;
        adj = new ArrayList<>();

        for (int i = 0; i < vertices; i++) {
            adj.add(new ArrayList<>());
        }
    }

    void addEdge(int source, int dest) {
        adj.get(source).add(dest);
        if (!directed) {
            adj.get(dest).add(source);
        }
    }

    void printList() {
        for (int i = 0; i < vertices; i++) {
            System.out.print(i + " -> ");
            for (int x : adj.get(i)) {
                System.out.print(x + " ");
            }
            System.out.println();
        }
    }
    void bfs(int start) {
        boolean[] visited = new boolean[vertices];
        Queue<Integer> q = new LinkedList<>();

        visited[start] = true;
        q.add(start);

        while (!q.isEmpty()) {
            int node = q.poll();
            System.out.print(node + " ");

            for (int neighbor : adj.get(node)) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    q.add(neighbor);
                }
            }
        }
        System.out.println();
    }
    void dfs(int start) {
        boolean[] visited = new boolean[vertices];
        dfsUtil(start, visited);
        System.out.println();
    }

    void dfsUtil(int node, boolean[] visited) {
        visited[node] = true;
        System.out.print(node + " ");

        for (int neighbor : adj.get(node)) {
            if (!visited[neighbor]) {
                dfsUtil(neighbor, visited);
            }
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter number of vertices: ");
        int v = sc.nextInt();

        System.out.print("Enter number of edges: ");
        int e = sc.nextInt();

        Graph g = new Graph(v, false);

        System.out.println(" ");
        for (int i = 0; i < e; i++) {
            int s = sc.nextInt();
            int d = sc.nextInt();
            g.addEdge(s, d);
        }

        g.printList();

        System.out.print("BFS Traversal: ");
        g.bfs(0);

        System.out.print("DFS Traversal: ");
        g.dfs(0);
    }
}
