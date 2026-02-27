using UnityEngine;
using UnityEngine.AI;

public class TrafficCarAI : MonoBehaviour
{
    public Transform[] waypoints;
    public float stopDistance = 1f;
    public float waitTime = 1f;

    private NavMeshAgent agent;
    private int currentIndex = 0;
    private float waitTimer = 0f;

    void Awake()
    {
        agent = GetComponent<NavMeshAgent>();
    }

    void Start()
    {
        if (waypoints.Length > 0)
            agent.SetDestination(waypoints[currentIndex].position);
    }

    void Update()
    {
        if (waypoints.Length == 0) return;

        if (!agent.pathPending && agent.remainingDistance < stopDistance)
        {
            waitTimer += Time.deltaTime;
            if (waitTimer >= waitTime)
            {
                currentIndex = (currentIndex + 1) % waypoints.Length;
                agent.SetDestination(waypoints[currentIndex].position);
                waitTimer = 0f;
            }
        }
    }
}
