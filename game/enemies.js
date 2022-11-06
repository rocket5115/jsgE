class EnemiesCreator {
    constructor(id,object) {
        this.id = id;
        this.obj = object;
        this.objects = [];
    };
    CreateProjectile(width, height, left, speed, metadata) {
        let collision = metadata.OnCollision!=undefined;
        let retval = [];
        if(collision){
            
        };
    };
    CreateEnemy(width,height) {

    };
    SetEnemyMovementPattern(pattern) {

    };
};