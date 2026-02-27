using UnityEngine;
using UnityEngine.AI;

public class PoliceAI : MonoBehaviour
{
    public Transform player;
    public float detectRange = 15f;
    public float attackRange = 2f;
    public float damage = 10f;
    public float attackCooldown = 1.5f;

    private NavMeshAgent agent;
    private float attackTimer = 0f;
    private bool chasing = false;

    void Awake()
    {
        agent = GetComponent<NavMeshAgent>();
    }

    void Update()
    {
        if (player == null) return;

        float dist = Vector3.Distance(transform.position, player.position);

        // Detect player
        if (!chasing && dist <= detectRange)
        {
            chasing = true;
        }

        // Chase player
        if (chasing)
        {
            agent.SetDestination(player.position);

            // Attack player
            if (dist <= attackRange)
            {
                attackTimer += Time.deltaTime;
                if (attackTimer >= attackCooldown)
                {
                    GameManager.Instance.TakeDamage((int)damage);
                    attackTimer = 0f;
                }
            }
        }
    }
}
