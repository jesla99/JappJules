//Registros de almacen duplicados
select 
	a.* 
FROM 
	bod_almacen a
    INNER JOIN (SELECT d.n, d.bod_producto_id FROM (
            select 
                count(*) as n, bod_producto_id 
            FROM 
                bod_almacen 
            WHERE 
                1
            GROUP BY bod_producto_id ASC
        ) as d WHERE d.n>1
    ) as dup on dup.bod_producto_id=a.bod_producto_id 
WHERE 
   true



   //los registros correctos
SELECT 
	min(a.bod_almacen_id) bod_almacen_id,
    a.bod_producto_id
FROM 
	bod_almacen a
    INNER JOIN (
		SELECT 
        	d.n, 
        	d.bod_producto_id 
       	FROM (
            select 
                count(*) as n, bod_producto_id 
            FROM 
                bod_almacen 
            WHERE 
                1
            GROUP BY bod_producto_id ASC
        ) as d WHERE d.n>1
    ) d on a.bod_producto_id = d.bod_producto_id
GROUP BY 2


///todos los incorrecotos menos los correctos
select 
	a.* 
FROM 
	bod_almacen a
    INNER JOIN (SELECT d.n, d.bod_producto_id FROM (
            select 
                count(*) as n, bod_producto_id 
            FROM 
                bod_almacen 
            WHERE 
                1
            GROUP BY bod_producto_id ASC
        ) as d WHERE d.n>1
    ) as dup on dup.bod_producto_id=a.bod_producto_id 
WHERE 
   a.bod_almacen_id not in(
	select correcto.bod_almacen_id FROM (
        SELECT 
            min(a.bod_almacen_id) bod_almacen_id,
            a.bod_producto_id
        FROM 
            bod_almacen a
            INNER JOIN (
                SELECT 
                    d.n, 
                    d.bod_producto_id 
                FROM (
                    select 
                        count(*) as n, bod_producto_id 
                    FROM 
                        bod_almacen 
                    WHERE 
                        1
                    GROUP BY bod_producto_id ASC
                ) as d WHERE d.n>1
            ) d on a.bod_producto_id = d.bod_producto_id
        GROUP BY 2
     ) as correcto
       
  )