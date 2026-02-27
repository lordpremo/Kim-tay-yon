using UnityEngine;

public class Bullet : MonoBehaviour
{
    public float speed = 40f;
    public float lifeTime = 3f;
    public int damage = 20;

    void Start()
    {
        Destroy(gameObject, lifeTime);
    }

    void Update()
    {
        transform.Translate(Vector3.forward * speed * Time.deltaTime);
    }

    void OnTriggerEnter(Collider other)
    {
        // Damage police
        var police = other.GetComponent<PoliceAI>();
        if (police != null)
        {
            // Kwa sasa, tuwaue instantly au baadaye tuweke health
            Destroy(other.gameObject);
            WantedSystem.Instance.AddWanted(1);
        }

        // Damage NPC (optional)
        var npc = other.GetComponent<NPCWalker>();
        if (npc != null)
        {
            Destroy(other.gameObject);
            WantedSystem.Instance.AddWanted(1);
        }

        Destroy(gameObject);
    }
}
